class CreateSessionsAndAscents < ActiveRecord::Migration[8.1]
  def change
    create_table :sessions do |t|
      t.string :description
      t.timestamps
    end

    create_table :ascents do |t|
      t.references :session, null: false, foreign_key: true
      t.integer :color
      t.integer :tries

      t.timestamps
    end
  end
end
