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
FactoryBot.define do
  factory :data_export do
    user { FactoryBot.create(:user, :user_pass) }
    status { :pending }
    file_path { nil }
    error_message { nil }
  end
end
