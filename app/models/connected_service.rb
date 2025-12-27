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
class ConnectedService < ApplicationRecord
  belongs_to :user

  validates :provider,
            presence: true,
            inclusion: { in: Rails.application.config.x.omniauth.allowed_providers }
end
