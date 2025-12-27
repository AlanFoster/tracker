# == Schema Information
#
# Table name: users
#
#  id              :integer          not null, primary key
#  display_name    :string
#  email_address   :string           not null
#  password_digest :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_users_on_display_name   (display_name) UNIQUE
#  index_users_on_email_address  (email_address) UNIQUE
#
FactoryBot.define do
  factory :user do
    sequence(:email_address) { |n| "user#{n}@example.com" }
    sequence(:display_name) { |n| "user#{n}" }

    trait :user_pass do
      password { "password123" }
      password_confirmation { "password123" }
    end

    trait :google_oauth2 do
      after(:build) do |user, _evaluator|
        user.connected_services = FactoryBot.build_list(
          :connected_service,
          1,
          :google_oauth2,
          user: user
        )
      end
    end
  end
end
