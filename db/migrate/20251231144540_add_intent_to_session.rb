class AddIntentToSession < ActiveRecord::Migration[8.2]
  def change
    add_column :sessions, :intent, :integer, default: 0
  end
end
