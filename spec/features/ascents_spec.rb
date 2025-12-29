require "rails_helper"

RSpec.describe "Homepage", type: :feature do
  let!(:user) { User.create!(display_name: 'test_user', email_address: "test@example.com", password: "password") }

  def login_as(user)
    page.visit '/'
    expect(page).to have_content 'Sign in'

    # Fill in the login form
    fill_in "email_address", with: user.email_address
    fill_in "password", with: 'password'

    click_button 'Sign in'

    expect(page).to_not have_content 'Sign in'
    expect(page).to have_content 'Overview'
  end

  def now(message)
    yield
  end

  describe 'creating a session and ascents' do
    it 'logs in successfully' do
      login_as(user)

      now "create a session" do
        click_link 'Create your first session'
        fill_in 'session[description]', with: 'my first session'
        click_button 'Add'
        expect(page).to_not have_content 'New Session'
      end

      now "create flash ascents" do
        expect(page).to have_content 'No ascents registered yet.'

        colors = %w[white purple red red]
        colors.each do |color|
          click_link 'New Ascent'

          click_button color
          expect(page).to have_selector('[data-testid=selected-color]', text: color.upcase)
          expect(page).to have_content 'flash'
          expect(page).to have_selector("[name='ascent[completed]']:checked", visible: false)
          click_button 'Create'
          expect(page).to_not have_content 'Create'
        end
      end

      now "create invalid flash ascents" do
        click_link 'New Ascent'
        click_button 'red'
        expect(page).to have_content 'flash'
        expect(page).to have_selector("[name='ascent[completed]']:checked", visible: false)

        now "create invalid flash details" do
          find('.MuiCheckbox-root').click
          click_button 'Create'
          expect(page).to have_content 'If the ascent was flashed, it must be marked as completed'
        end

        now "correct the mistake" do
          find('[aria-label="Increase"]').click
        end

        click_button 'Create'
        expect(page).to_not have_content 'Create'
      end

      now "verify summaries" do
        expect(page).to have_selector('[data-testid=ascents-summary-white]', text: '1')
        expect(page).to have_selector('[data-testid=ascents-summary-purple]', text: '1')
        expect(page).to have_selector('[data-testid=ascents-summary-red]', text: '3')
      end
    end
  end
end
