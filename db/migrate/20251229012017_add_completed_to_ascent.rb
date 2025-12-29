class AddCompletedToAscent < ActiveRecord::Migration[8.2]
  def change
    add_column :ascents, :completed, :boolean
  end
end
