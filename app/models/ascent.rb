# == Schema Information
#
# Table name: ascents
#
#  id         :integer          not null, primary key
#  color      :integer
#  completed  :boolean
#  notes      :string
#  tags       :text             default([])
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

  # Serialize tags as JSON array
  serialize :tags, coder: JSON, type: Array

  # Available ascent type tags
  AVAILABLE_TAGS = [
    'balance',
    'compression',
    'crimpy',
    'dyno',
    'endurance',
    'juggy',
    'overhang',
    'pinches',
    'pockets',
    'powerful',
    'roof',
    'slab',
    'sloper',
    'technical'
  ].freeze

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
  validate :tags_are_valid

  validates :notes, length: {minimum: 0, maximum: 256}, allow_blank: true

  def completed_if_flashed
    if tries === 0 && !completed
      errors.add(:completed, 'If the ascent was flashed, it must be marked as completed')
    end
  end

  def tags_are_valid
    return if tags.blank?

    invalid_tags = tags - AVAILABLE_TAGS
    if invalid_tags.any?
      errors.add(:tags, "contains invalid tags: #{invalid_tags.join(', ')}")
    end
  end
end
