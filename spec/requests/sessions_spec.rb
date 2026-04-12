require "rails_helper"

RSpec.describe SessionsController, type: :request do
  let!(:user) { FactoryBot.create(:user, :user_pass) }

  before { sign_in(user) }

  describe "GET /sessions climbsOverTime" do
    context "with no ascents" do
      it "returns an empty array" do
        get sessions_path, headers: { "Accept" => "application/json" }
        json = JSON.parse(response.body)
        expect(json["data"]["climbsOverTime"]).to eq([])
      end
    end

    context "with ascents across multiple days and colors" do
      let!(:session1) { FactoryBot.create(:session, user: user) }
      let!(:session2) { FactoryBot.create(:session, user: user) }

      before do
        day1 = 3.days.ago
        day2 = 1.day.ago

        FactoryBot.create(:ascent, session: session1, color: :red, completed: true, tries: 0, created_at: day1)
        FactoryBot.create(:ascent, session: session1, color: :red, completed: true, tries: 0, created_at: day1)
        FactoryBot.create(:ascent, session: session2, color: :blue, completed: true, tries: 1, created_at: day2)
      end

      it "returns one row per day with cumulative counts" do
        get sessions_path, headers: { "Accept" => "application/json" }
        json = JSON.parse(response.body)
        rows = json["data"]["climbsOverTime"]

        expect(rows.length).to eq(2)

        first_row = rows.first
        expect(first_row["red"]).to eq(2)
        expect(first_row["blue"]).to eq(0)

        second_row = rows.last
        expect(second_row["red"]).to eq(2)  # cumulative — still 2
        expect(second_row["blue"]).to eq(1)
      end

      it "includes all color keys in every row" do
        get sessions_path, headers: { "Accept" => "application/json" }
        json = JSON.parse(response.body)
        rows = json["data"]["climbsOverTime"]

        expected_colors = Ascent.colors.keys
        rows.each do |row|
          expect(row.keys).to include("date", *expected_colors)
        end
      end
    end
  end
end
