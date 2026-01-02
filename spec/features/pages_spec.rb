require "rails_helper"

RSpec.describe "Pages", type: :feature do
  describe 'home' do
    it 'has a home page' do
      page.visit '/'
      expect(page).to have_content 'Welcome to Tracker'
      # oauth requirements
      expect(page).to have_content 'Terms of Service'
      expect(page).to have_content 'Privacy Policy'
    end
  end

  describe 'privacy' do
    it 'has an available document' do
      page.visit '/privacy'
      expect(page).to have_content 'Privacy Policy'
      expect(page).to have_content /contact us at .* \[at\] .* \[dot\] .*/
    end
  end

  describe 'terms' do
    it 'has an available document' do
      page.visit '/terms'
      expect(page).to have_content 'Terms of Service'
      expect(page).to have_content /contact: .* \[at\] .* \[dot\] .*/
    end
  end
end
