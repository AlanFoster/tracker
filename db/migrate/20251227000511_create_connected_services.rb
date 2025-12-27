class CreateConnectedServices < ActiveRecord::Migration[8.1]
  def change
    create_table :connected_services do |t|
      t.references :user, null: false, foreign_key: true
      t.string :provider
      t.string :uid

      t.timestamps
    end

    # Make password_digest optional on users - for the scenario of oauth being used
    change_column_null :users, :password_digest, true
  end
end
