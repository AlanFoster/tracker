require "rails_helper"

RSpec.describe SessionsController, type: :request do
  let!(:user) { FactoryBot.create(:user, :user_pass) }

  before { sign_in(user) }

  describe "GET /sessions climbsOverTime" do
    context "with no ascents" do
      it "returns an empty array" do
        get sessions_path, headers: { "Accept" => "application/json" }
        json = JSON.parse(response.body)
        expect(json["data"]["climbsOverTime"]["daily"]).to eq([])
        expect(json["data"]["climbsOverTime"]["cumulative"]).to eq([])
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

      it "returns daily counts (non-cumulative)" do
        get sessions_path, headers: { "Accept" => "application/json" }
        json = JSON.parse(response.body)
        rows = json["data"]["climbsOverTime"]["daily"]

        expect(rows.length).to eq(2)
        expect(rows.first["red"]).to eq(2)
        expect(rows.first["blue"]).to eq(0)
        expect(rows.last["red"]).to eq(0)
        expect(rows.last["blue"]).to eq(1)
      end

      it "returns cumulative counts" do
        get sessions_path, headers: { "Accept" => "application/json" }
        json = JSON.parse(response.body)
        rows = json["data"]["climbsOverTime"]["cumulative"]

        expect(rows.length).to eq(2)
        expect(rows.first["red"]).to eq(2)
        expect(rows.last["red"]).to eq(2)  # still 2 — cumulative
        expect(rows.last["blue"]).to eq(1)
      end

      it "includes all color keys in every row" do
        get sessions_path, headers: { "Accept" => "application/json" }
        json = JSON.parse(response.body)
        expected_colors = Ascent.colors.keys
        json["data"]["climbsOverTime"].each_value do |rows|
          rows.each { |row| expect(row.keys).to include("date", *expected_colors) }
        end
      end
    end
  end
end
