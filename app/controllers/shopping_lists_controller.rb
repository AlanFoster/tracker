class ShoppingListsController < ApplicationController
  def show
    @items = Item.all
  end
end
