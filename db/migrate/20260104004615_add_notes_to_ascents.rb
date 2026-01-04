class AddNotesToAscents < ActiveRecord::Migration[8.2]
  def change
    add_column :ascents, :notes, :string
  end
end
