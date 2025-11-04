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
  has_many :ascents

  def title
    @title ||= "Session #{created_at.strftime("%Y-%m-%d")}"
  end
end
