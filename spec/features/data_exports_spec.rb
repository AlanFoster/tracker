require "rails_helper"

RSpec.describe "Data Exports", type: :feature do
  let(:user) { User.create!(display_name: 'test_user', email_address: "test@example.com", password: "password") }

  def login_as(user)
    page.visit '/'
    click_link 'Sign In'

    fill_in "email_address", with: user.email_address
    fill_in "password", with: 'password'

    click_button 'Sign in'

    expect(page).to_not have_content 'Sign in'
    expect(page).to have_content 'Overview'
  end

  def navigate_to_profile
    find('[aria-label="account of current user"]').click
    click_link 'Profile'
  end

  describe "data export workflow" do
    it "creates export and displays in history with correct statuses" do
      # Create exports with different statuses
      FactoryBot.create(:data_export, user: user, status: :pending)
      FactoryBot.create(:data_export, user: user, status: :completed)
      FactoryBot.create(:data_export, user: user, status: :failed)

      login_as(user)
      navigate_to_profile

      # Verify export section exists
      expect(page).to have_content 'Data Export'
      expect(page).to have_selector('[data-testid="download-data-button"]')

      # Verify history displays all exports with correct statuses
      expect(page).to have_content '3 exports'
      expect(page).to have_content 'Queued'
      expect(page).to have_content 'Ready'
      expect(page).to have_content 'Failed'

      # Verify creation time is displayed
      expect(page).to have_content Date.today.strftime("%b %d, %Y")
    end

    it "prevents multiple concurrent exports" do
      FactoryBot.create(:data_export, user: user, status: :pending)

      login_as(user)
      navigate_to_profile

      # Button should be disabled when export is in progress
      expect(page).to have_selector('[data-testid="download-data-button"][disabled]')
    end

    it "shows download button only for completed exports with files" do
      file_path = Rails.root.join('tmp', 'test_export.json')
      FileUtils.touch(file_path)

      completed_with_file = FactoryBot.create(:data_export, user: user, status: :completed, file_path: file_path.to_s)
      completed_no_file = FactoryBot.create(:data_export, user: user, status: :completed, file_path: nil)
      pending = FactoryBot.create(:data_export, user: user, status: :pending)

      login_as(user)
      navigate_to_profile

      # Download button visible only for completed export with file
      expect(page).to have_selector("[data-testid='download-export-#{completed_with_file.id}']")
      expect(page).not_to have_selector("[data-testid='download-export-#{completed_no_file.id}']", visible: true)
      expect(page).not_to have_selector("[data-testid='download-export-#{pending.id}']", visible: true)

      File.delete(file_path) if File.exist?(file_path)
    end

    it "deletes single export and cleans up file" do
      file_path = Rails.root.join('tmp', 'test_export_delete.json')
      FileUtils.touch(file_path)

      export = FactoryBot.create(:data_export, user: user, status: :completed, file_path: file_path.to_s)

      expect(File.exist?(file_path)).to be true

      login_as(user)
      navigate_to_profile

      delete_button = find("[data-testid='delete-export-#{export.id}']")
      delete_button.click
      click_button 'Delete'

      expect(page).to have_content 'Export deleted successfully'
      expect(File.exist?(file_path)).to be false
    end

    it "shows only current user's exports" do
      other_user = User.create!(display_name: 'other_user', email_address: "other@example.com", password: "password")
      user_export = FactoryBot.create(:data_export, user: user, status: :completed)
      other_export = FactoryBot.create(:data_export, user: other_user, status: :completed)

      login_as(user)
      navigate_to_profile

      expect(page).to have_content '1 export'
      # Verify the other user's export is not visible by checking the table only shows 1 row
      expect(page).to have_selector('tbody tr', count: 1)
    end
  end
end
