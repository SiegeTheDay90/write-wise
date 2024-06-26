# frozen_string_literal: true

class AddOmniAuthToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :provider, :string
    add_column :users, :uid, :string
  end
end
