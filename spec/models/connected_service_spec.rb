# == Schema Information
#
# Table name: connected_services
#
#  id         :integer          not null, primary key
#  provider   :string
#  uid        :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :integer          not null
#
# Indexes
#
#  index_connected_services_on_user_id  (user_id)
#
# Foreign Keys
#
#  user_id  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe ConnectedService, type: :model do
  describe "associations" do
    it { should belong_to(:user) }
  end

  describe 'validations' do
    it { should validate_inclusion_of(:provider).in_array(['google_oauth2']) }
  end
end
