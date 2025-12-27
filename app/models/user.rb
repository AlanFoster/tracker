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
class User < ApplicationRecord
  has_secure_password validations: false

  has_many :user_sessions, dependent: :destroy
  has_many :connected_services, dependent: :destroy
  has_many :sessions, dependent: :destroy

  # Validate password presence only if no OAuth connected service exists
  validates :password,
            presence: true,
            confirmation: true,
            length: { minimum: 6 },
            on: :create,
            if: :password_required?

  normalizes :email_address, with: ->(e) { e.strip.downcase }
  normalizes :display_name, with: ->(e) { e.strip.downcase }

  validates :email_address, presence: true, uniqueness: { case_sensitive: false }

  validates :display_name,
            presence: true,
            uniqueness: { case_sensitive: false },
            length: { minimum: 3, maximum: 14 },
            format: { with: /\A[a-zA-Z0-9_-]+\z/,
                      message: "can only contain letters, numbers, and underscores" }

  def password_required?
    # Require password if:
    # 1) No connected services exist - i.e. account created via oauth
    # 2) New record or password was changed
    connected_services.empty? || !password.nil?
  end
end
