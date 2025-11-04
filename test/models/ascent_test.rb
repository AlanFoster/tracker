# == Schema Information
#
# Table name: ascents
#
#  id         :integer          not null, primary key
#  color      :integer
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
require "test_helper"

class AscentTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
