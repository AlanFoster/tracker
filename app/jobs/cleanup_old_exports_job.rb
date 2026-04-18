class CleanupOldExportsJob < ApplicationJob
  queue_as :default

  def perform
    # Delete exports older than 7 days
    DataExport.where('created_at < ?', 7.days.ago).destroy_all
    Rails.logger.info("Cleaned up old data exports")
  end
end
