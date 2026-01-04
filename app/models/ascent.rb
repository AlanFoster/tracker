# == Schema Information
#
# Table name: ascents
#
#  id         :integer          not null, primary key
#  color      :integer
#  completed  :boolean
#  notes      :string
#  tries      :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  session_id :integer          not null
#
# Indexes
#
#  index_ascents_on_session_id  (session_id)
#
# Foreign Keys
#
#  session_id  (session_id => sessions.id)
#
class Ascent < ApplicationRecord
  belongs_to :session

  enum :color, {
    orange: 0,
    blue: 1,
    white: 2,
    green: 3,
    yellow: 4,
    purple: 5,
    red: 6,
    black: 7,
    pink: 8
  }

  validates :tries, numericality: { greater_than_or_equal_to: 0 }
  validate :completed_if_flashed

  validates :notes, length: {minimum: 0, maximum: 256}, allow_blank: true

  def completed_if_flashed
    if tries === 0 && !completed
      errors.add(:completed, 'If the ascent was flashed, it must be marked as completed')
    end
  end
end
