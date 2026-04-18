class CreateDataExports < ActiveRecord::Migration[8.2]
  def change
    create_table :data_exports do |t|
      t.references :user, null: false, foreign_key: true
      t.string :status
      t.string :file_path
      t.text :error_message

      t.timestamps
    end
  end
end
