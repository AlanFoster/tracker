# == Schema Information
#
# Table name: data_exports
#
#  id            :integer          not null, primary key
#  error_message :text
#  file_path     :string
#  status        :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  user_id       :integer          not null
#
# Indexes
#
#  index_data_exports_on_user_id  (user_id)
#
# Foreign Keys
#
#  user_id  (user_id => users.id)
#
require "rails_helper"

RSpec.describe DataExport, type: :model do
  describe "associations" do
    it { should belong_to(:user) }
  end

  describe "validations" do
    subject { FactoryBot.build(:data_export) }

    it { should validate_presence_of(:status) }
  end

  describe "enums" do
    it { should define_enum_for(:status).with_values(pending: 'pending', processing: 'processing', completed: 'completed', failed: 'failed').backed_by_column_of_type(:string) }
  end

  describe ".inflight" do
    let(:user) { FactoryBot.create(:user, :user_pass) }

    it "returns exports with pending or processing status" do
      pending_export = FactoryBot.create(:data_export, user: user, status: :pending)
      # Create other exports with completed status first, then update them
      processing_export = FactoryBot.create(:data_export, user: user, status: :completed)
      completed_export = FactoryBot.create(:data_export, user: user, status: :completed)
      failed_export = FactoryBot.create(:data_export, user: user, status: :failed)

      # Update the statuses directly in the database to bypass validation
      processing_export.update_column(:status, 'processing')

      expect(DataExport.inflight).to contain_exactly(pending_export, processing_export)
    end
  end

  describe "#no_inflight_exports" do
    let(:user) { FactoryBot.create(:user, :user_pass) }

    context "when no inflight exports exist" do
      it "allows creation" do
        export = FactoryBot.build(:data_export, user: user, status: :pending)
        expect(export).to be_valid
      end
    end

    context "when a pending export exists" do
      before { FactoryBot.create(:data_export, user: user, status: :pending) }

      it "prevents creation" do
        new_export = FactoryBot.build(:data_export, user: user, status: :pending)
        expect(new_export).not_to be_valid
        expect(new_export.errors[:base]).to include('An export is already in progress. Please wait for it to complete.')
      end
    end

    context "when a processing export exists" do
      before { FactoryBot.create(:data_export, user: user, status: :processing) }

      it "prevents creation" do
        new_export = FactoryBot.build(:data_export, user: user, status: :pending)
        expect(new_export).not_to be_valid
      end
    end

    context "when only completed exports exist" do
      before { FactoryBot.create(:data_export, user: user, status: :completed) }

      it "allows creation" do
        export = FactoryBot.build(:data_export, user: user, status: :pending)
        expect(export).to be_valid
      end
    end

    context "when only failed exports exist" do
      before { FactoryBot.create(:data_export, user: user, status: :failed) }

      it "allows creation" do
        export = FactoryBot.build(:data_export, user: user, status: :pending)
        expect(export).to be_valid
      end
    end
  end

  describe "#cleanup_file" do
    let(:user) { FactoryBot.create(:user, :user_pass) }
    let(:file_path) { Rails.root.join('tmp', 'test_export.csv') }

    before { FileUtils.touch(file_path) }

    it "deletes the file on destroy" do
      export = FactoryBot.create(:data_export, user: user, file_path: file_path.to_s)
      expect(File.exist?(file_path)).to be true

      export.destroy

      expect(File.exist?(file_path)).to be false
    end

    it "handles missing files gracefully" do
      export = FactoryBot.create(:data_export, user: user, file_path: '/nonexistent/path/file.csv')
      expect { export.destroy }.not_to raise_error
    end

    it "logs a warning if file deletion fails" do
      export = FactoryBot.create(:data_export, user: user, file_path: '/invalid/path/file.csv')
      allow(File).to receive(:exist?).and_return(true)
      allow(File).to receive(:delete).and_raise(StandardError, "Permission denied")
      allow(Rails.logger).to receive(:warn)

      export.destroy

      expect(Rails.logger).to have_received(:warn).with(/Failed to delete export file/)
    end

    it "does not attempt deletion when file_path is nil" do
      export = FactoryBot.create(:data_export, user: user, file_path: nil)
      allow(File).to receive(:delete)

      export.destroy

      expect(File).not_to have_received(:delete)
    end
  end
end
