# == Schema Information
#
# Table name: data_exports
#
#  id            :integer          not null, primary key
#  error_message :text
#  file_path     :string
#  status        :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  user_id       :integer          not null
#
# Indexes
#
#  index_data_exports_on_user_id  (user_id)
#
# Foreign Keys
#
#  user_id  (user_id => users.id)
#
class DataExport < ApplicationRecord
  belongs_to :user

  enum :status, { pending: 'pending', processing: 'processing', completed: 'completed', failed: 'failed' }

  validates :user, presence: true
  validates :status, presence: true, inclusion: { in: statuses.keys }
  validate :no_inflight_exports, on: :create

  scope :inflight, -> { where(status: [:pending, :processing]) }

  before_destroy :cleanup_file

  private

  def no_inflight_exports
    if status.in?(['pending', 'processing']) && user.data_exports.inflight.exists?
      errors.add(:base, 'An export is already in progress. Please wait for it to complete.')
    end
  end

  def cleanup_file
    return unless file_path && File.exist?(file_path)
    File.delete(file_path)
  rescue StandardError => e
    Rails.logger.warn("Failed to delete export file #{file_path}: #{e.message}")
  end
end
