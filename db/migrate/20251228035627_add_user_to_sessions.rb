class AddUserToSessions < ActiveRecord::Migration[8.2]
  def change
    add_reference :sessions, :user, null: false, foreign_key: true
  end
end
