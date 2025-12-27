# == Schema Information
#
# Table name: sessions
#
#  id          :integer          not null, primary key
#  description :string
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
require 'rails_helper'

RSpec.describe Session, type: :model do
  describe "associations" do
    it { should belong_to(:user) }
  end

  describe 'validations' do
    it { should validate_length_of(:description).is_at_least(5).is_at_most(64) }
    it { should_not allow_value('').for(:description) }
    it { should_not allow_value(nil).for(:description) }
  end
end
