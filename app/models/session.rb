# == Schema Information
#
# Table name: sessions
#
#  id          :integer          not null, primary key
#  description :string
#  intent      :integer          default("fun")
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  user_id     :integer          not null
#
# Indexes
#
#  index_sessions_on_user_id  (user_id)
#
# Foreign Keys
#
#  user_id  (user_id => users.id)
#
class Session < ApplicationRecord
  has_many :ascents, dependent: :destroy
  belongs_to :user

  validates :description, length: {minimum: 0, maximum: 64}, allow_blank: true

  enum :intent, {
    fun: 0,
    volume: 1,
    projecting: 3,
    recovery: 4,
    technique: 5,
    power: 6
  }

  def title
    @title ||= "Session #{created_at.strftime("%Y-%m-%d")}#{description.presence ? " - #{description}" : ''}"
  end
end
