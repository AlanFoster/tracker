# == Schema Information
#
# Table name: users
#
#  id              :integer          not null, primary key
#  display_name    :string
#  email_address   :string           not null
#  password_digest :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_users_on_display_name   (display_name) UNIQUE
#  index_users_on_email_address  (email_address) UNIQUE
#
require "rails_helper"

RSpec.describe User, type: :model do
  describe "associations" do
    it { should have_many(:connected_services).dependent(:destroy) }
  end

  describe "validations" do
    subject { FactoryBot.build(:user) }

    it { is_expected.to validate_presence_of(:display_name) }

    it do
      is_expected
        .to validate_uniqueness_of(:display_name)
              .case_insensitive
    end

    it do
      is_expected
        .to validate_length_of(:display_name)
              .is_at_least(3)
              .is_at_most(14)
    end

    it { should validate_presence_of(:email_address) }
    it { should validate_uniqueness_of(:email_address).case_insensitive }

    # Conditional password validation
    context "without connected services" do
      subject { User.new(display_name: 'foo', email_address: "test@example.com", password: "password123") }
      it { should validate_length_of(:password).is_at_least(6) }
      it { should validate_presence_of(:password) }
    end

    context "with connected service (OAuth)" do
      subject do
        user = FactoryBot.create(:user, :google_oauth2)
        user
      end

      it "does not require a password" do
        expect(subject).to be_valid
      end
    end
  end

  describe "normalization" do
    it "strips whitespace and downcases display_name" do
      user = FactoryBot.create(:user, :user_pass, display_name: "  AlIcE  ")
      expect(user.display_name).to eq("alice")
    end

    it "runs normalization before validation" do
      user = FactoryBot.build(:user, :user_pass, display_name: "  ALICE  ")
      user.valid?

      expect(user.display_name).to eq("alice")
    end

    it "is nil-safe before validation" do
      user = FactoryBot.build(:user, :user_pass, display_name: nil)
      expect { user.valid? }.not_to raise_error
    end
  end

  describe "normalized uniqueness behavior" do
    it "treats differently cased or spaced names as duplicates" do
      FactoryBot.create(:user, :user_pass, display_name: "Alice")

      duplicate = FactoryBot.build(:user, :user_pass, display_name: "  aLiCe  ")
      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:display_name]).to include("has already been taken")
    end
  end
end
