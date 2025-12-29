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
require "rails_helper"

RSpec.describe Ascent, type: :model do
  describe "associations" do
    it { should belong_to(:session) }
  end

  describe "validations" do
    # subject { FactoryBot.build(:user) }

    it { should validate_numericality_of(:tries).is_greater_than_or_equal_to(0) }
  end

  describe '#completed_if_flashed' do
    it 'is valid when flashed and completed' do
      model = FactoryBot.build(:ascent, tries: 0, completed: true)
      expect(model).to be_valid
    end

    it 'is invalid when flashed and not completed' do
      model = FactoryBot.build(:ascent, tries: 0, completed: false)
      expect(model).to_not be_valid
    end

    it 'is invalid when not flashed and completed' do
      model = FactoryBot.build(:ascent, tries: 1, completed: true)
      expect(model).to be_valid
    end

    it 'is invalid when not flashed and not completed' do
      model = FactoryBot.build(:ascent, tries: 3, completed: false)
      expect(model).to be_valid
    end
  end
end
