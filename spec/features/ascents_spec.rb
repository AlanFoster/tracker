require "rails_helper"

RSpec.describe "Homepage", type: :feature do
  let!(:user) { User.create!(display_name: 'test_user', email_address: "test@example.com", password: "password") }

  def login_as(user)
    page.visit '/'
    click_link 'Sign In'

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
    it 'works successfully' do
      login_as(user)

      now "create a session" do
        click_link 'Create your first session'
        fill_in 'session[description]', with: 'my first session'
        click_button 'Add'
        expect(page).to_not have_content 'Create your first session'
      end

      now "create flash ascents" do
        expect(page).to have_content 'No ascents registered yet.'

        click_link 'Add'
        colors = %w[white red purple red]
        colors.each do |color|
          click_button color
          expect(page).to have_selector('[data-testid=selected-color]', text: color.upcase)
          expect(page).to have_content 'flash'
          expect(page).to have_selector("[name='ascent[completed]']:checked", visible: false)
          click_button 'Create'
          expect(page).to have_content "#{color} ascent added successfully!"
        end

        click_button 'Cancel'
        # Wait for modal to close
        expect(page).to_not have_content 'New Ascent'
      end

      now "create invalid flash ascents" do
        click_link 'Add'
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
        expect(page).to have_content 'red ascent added successfully!'
        click_button "Cancel"
        expect(page).to_not have_content 'red ascent added successfully!'
      end

      now "verify graph view summaries" do
        find('[aria-label="ascent summary graph view"]').click
        within '[data-testid="ascent-summary-graph-view"]' do
          expect(page).to have_content('1 White')
          expect(page).to have_content('1 Purple')
          expect(page).to have_content('3 Red')
        end
      end

      now "verify grid view summaries" do
        find('[aria-label="ascent summary grid view"]').click
        expect(page).to have_selector('[data-testid=ascents-summary-white]', text: '1')
        expect(page).to have_selector('[data-testid=ascents-summary-purple]', text: '1')
        expect(page).to have_selector('[data-testid=ascents-summary-red]', text: '3')
      end

      now "verify dashboard" do
        click_link 'Statistics'
        expect(page).to have_content 'Climbs Over Time'
        within '[data-testid="climbs-over-time-chart"]' do
          expect(page).to have_content 'White'
          expect(page).to have_content 'Purple'
          expect(page).to have_content 'Red'
        end
      end
    end
  end

  describe 'creating a session and tagging ascents' do
    it 'works successfully' do
      login_as(user)

      now "create a session" do
        click_link 'Create your first session'
        fill_in 'session[description]', with: 'my first session'
        click_button 'Add'
        expect(page).to_not have_content 'Create your first session'
      end

      now "add an ascent with tags" do
        click_link 'Add'
        click_button 'blue'

        # Wait for tags to be visible
        expect(page).to have_content 'Ascent Type Tags'

        # Select tags by clicking on the chip elements
        find('[data-testid="ascent-tag-slab"]').click
        find('[data-testid="ascent-tag-dyno"]').click

        # Verify tags are visually selected (they should have filled style)
        slab_chip = find('[data-testid="ascent-tag-slab"]')
        dyno_chip = find('[data-testid="ascent-tag-dyno"]')
        expect(slab_chip['class']).to include('MuiChip-filled')
        expect(dyno_chip['class']).to include('MuiChip-filled')

        click_button 'Create'
        expect(page).to have_content 'blue ascent added successfully!'
      end

      now "verify tags appear in list view" do
        # Close the modal by clicking Cancel
        click_button 'Cancel'

        # Switch to list view
        find('[aria-label="ascent list view"]').click

        # Verify tags are displayed in the list
        expect(page).to have_content 'Slab'
        expect(page).to have_content 'Dyno'
      end

      now "add an ascent with multiple tags" do
        # Open the modal again
        click_link 'Add'
        # Modal is already open from the redirect
        click_button 'green'

        # Wait for tags to be visible
        expect(page).to have_content 'Ascent Type Tags'

        # Select multiple tags
        find('[data-testid="ascent-tag-crimpy"]').click
        find('[data-testid="ascent-tag-technical"]').click
        find('[data-testid="ascent-tag-powerful"]').click

        # Verify all tags are visually selected
        expect(find('[data-testid="ascent-tag-crimpy"]')['class']).to include('MuiChip-filled')
        expect(find('[data-testid="ascent-tag-technical"]')['class']).to include('MuiChip-filled')
        expect(find('[data-testid="ascent-tag-powerful"]')['class']).to include('MuiChip-filled')

        click_button 'Create'
        expect(page).to have_content 'green ascent added successfully!'
      end

      now "verify multiple tags appear in list view" do
        # Close the modal by clicking Cancel
        click_button 'Cancel'

        # Switch to list view
        find('[aria-label="ascent list view"]').click

        # Verify all tags are displayed in the list
        expect(page).to have_content 'Crimpy'
        expect(page).to have_content 'Technical'
        expect(page).to have_content 'Powerful'
      end

      now "add an ascent with different tags" do
        # Open the modal again
        click_link 'Add'
        # Modal is already open from the redirect
        click_button 'yellow'

        # Wait for tags to be visible
        expect(page).to have_content 'Ascent Type Tags'

        # Select initial tags
        find('[data-testid="ascent-tag-overhang"]').click
        find('[data-testid="ascent-tag-balance"]').click

        # Verify tags are selected
        expect(find('[data-testid="ascent-tag-overhang"]')['class']).to include('MuiChip-filled')
        expect(find('[data-testid="ascent-tag-balance"]')['class']).to include('MuiChip-filled')

        click_button 'Create'
        expect(page).to have_content 'yellow ascent added successfully!'
      end
    end
  end
end
