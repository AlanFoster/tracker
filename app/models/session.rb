# == Schema Information
#
# Table name: sessions
#
#  id          :integer          not null, primary key
#  description :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
class Session < ApplicationRecord
  has_many :ascents, dependent: :delete_all

  validates :description, length: {minimum: 5, maximum: 64}, allow_blank: false

  def title
    @title ||= "Session #{created_at.strftime("%Y-%m-%d")}#{description ? " - #{description}" : ''}"
  end
end
