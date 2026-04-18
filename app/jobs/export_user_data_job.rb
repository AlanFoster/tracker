class ExportUserDataJob < ApplicationJob
  queue_as :default

  retry_on StandardError, wait: :exponentially_longer, attempts: 3
  discard_on ActiveJob::DeserializationError

  MAX_EXPORT_SIZE = 100.megabytes

  def perform(data_export_id)
    data_export = DataExport.find(data_export_id)
    user = data_export.user

    begin
      data_export.update(status: :processing)

      # Stream JSONL format for better memory efficiency
      filename = "climbing-tracker-data-#{Time.current.strftime('%Y%m%d-%H%M%S')}.jsonl"
      file_path = Rails.root.join('storage', 'exports', filename)
      FileUtils.mkdir_p(File.dirname(file_path))

      current_size = 0

      File.open(file_path, 'w') do |file|
        # Write user data
        user_line = {
          user: {
            id: user.id,
            email_address: user.email_address,
            display_name: user.display_name,
            created_at: user.created_at,
          }
        }.to_json + "\n"

        current_size += user_line.bytesize
        if current_size > MAX_EXPORT_SIZE
          raise "Export exceeds maximum size limit"
        end
        file.write(user_line)

        # Stream sessions to avoid memory issues
        user.sessions.includes(:ascents).find_each do |session|
          session_data = {
            session: {
              id: session.id,
              title: session.title,
              description: session.description,
              intent: session.intent,
              created_at: session.created_at,
              ascents: session.ascents.map do |ascent|
                {
                  id: ascent.id,
                  color: ascent.color,
                  tries: ascent.tries,
                  completed: ascent.completed,
                  tags: ascent.tags,
                  notes: ascent.notes,
                  created_at: ascent.created_at,
                }
              end,
            }
          }

          session_line = session_data.to_json + "\n"
          current_size += session_line.bytesize

          if current_size > MAX_EXPORT_SIZE
            raise "Export exceeds maximum size limit"
          end

          file.write(session_line)
        end
      end

      data_export.update(status: :completed, file_path: file_path.to_s)
      Rails.logger.info("User data export completed for user #{user.id}: #{filename} (#{current_size} bytes)")
    rescue => e
      # Clean up partial file if it exists
      File.delete(file_path) if file_path && File.exist?(file_path)
      data_export.update(status: :failed, error_message: e.message)
      Rails.logger.error("User data export failed for user #{user.id}: #{e.message}")
      raise
    end
  end
end
