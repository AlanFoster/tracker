require "rails_helper"

RSpec.describe "Homepage", type: :feature do
  let!(:user) { User.create!(display_name: 'test_user', email_address: "test@example.com", password: "password") }

  describe 'a valid login' do
    it 'logs in successfully' do
      page.visit '/'
      click_link 'Sign In'

      # Fill in the login form
      fill_in "email_address", with: user.email_address
      fill_in "password", with: 'password'

      click_button 'Sign in'

      expect(page).to_not have_content 'Sign in'
      expect(page).to have_content 'Overview'
      expect(page).to have_content 'No sessions created yet.'
    end

    it 'allows signing out' do
      page.visit '/'
      click_link 'Sign In'

      # Fill in the login form
      fill_in "email_address", with: user.email_address
      fill_in "password", with: 'password'

      click_button 'Sign in'

      find('[aria-label="account of current user"]').click
      click_button 'Sign out'

      expect(page).to have_content 'Sign in'
    end
  end

  describe 'an invalid' do
    it 'notifies the user about the login failure' do
      page.visit '/'
      click_link 'Sign In'

      # Fill in the login form
      fill_in "email_address", with: user.email_address
      fill_in "password", with: 'wrong_password'

      click_button 'Sign in'

      expect(page).to have_content 'Try another email address or password.'
    end
  end
end
