# == Schema Information
#
# Table name: ascents
#
#  id         :integer          not null, primary key
#  color      :integer
#  completed  :boolean
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
FactoryBot.define do
  factory :ascent do
    session
  end
end
