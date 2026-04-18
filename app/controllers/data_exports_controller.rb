class DataExportsController < ApplicationController
  before_action :set_user
  before_action :set_data_export, only: [:destroy, :download]
  rate_limit to: 5, within: 1.hour, only: :create, with: -> { redirect_to edit_user_url, alert: "Too many export requests. Please try again later." }

  def create
    data_export = @user.data_exports.build(status: :pending)

    if data_export.save
      ExportUserDataJob.perform_later(data_export.id)
      redirect_to edit_user_url, notice: 'Your data export has been queued. You will receive a download link shortly.'
    else
      redirect_to edit_user_url, alert: data_export.errors.full_messages.join(', ')
    end
  end

  def download
    if @data_export.completed?
      if @data_export.file_path && File.exist?(@data_export.file_path)
        # Validate file path is within expected directory to prevent path traversal
        safe_path = Rails.root.join('storage', 'exports', File.basename(@data_export.file_path))
        if File.exist?(safe_path) && File.realpath(safe_path).start_with?(Rails.root.join('storage', 'exports').to_s)
          send_file safe_path,
                    filename: File.basename(safe_path),
                    type: 'application/json',
                    x_sendfile: true
        else
          @data_export.update(file_path: nil)
          redirect_to edit_user_url, alert: 'Export file has expired'
        end
      else
        @data_export.update(file_path: nil)
        redirect_to edit_user_url, alert: 'Export file has expired'
      end
    else
      redirect_to edit_user_url, alert: 'Export is not ready'
    end
  end

  def destroy
    @data_export.destroy
    redirect_to edit_user_url, notice: 'Export deleted successfully'
  end

  def bulk_destroy
    export_ids = bulk_destroy_params[:export_ids]
    count = @user.data_exports.where(id: export_ids).destroy_all.count

    redirect_to edit_user_url, notice: "#{count} export(s) deleted successfully"
  end

  private

  def set_user
    @user = Current.user
  end

  def set_data_export
    @data_export = @user.data_exports.find(params[:id])
  end

  def bulk_destroy_params
    params.permit(export_ids: [])
  end
end
