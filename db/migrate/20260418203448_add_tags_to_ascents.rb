class AddTagsToAscents < ActiveRecord::Migration[8.2]
  def change
    add_column :ascents, :tags, :text, default: '[]'
  end
end
