class ItemsController < ApplicationController
  def show
    @item = Item.find(params[:id])
  end

  def create
    @item = Item.new(item_params.merge(completed: false))
    if @item.save
      @item.broadcast_append_later_to(
        "shopping",
        save_target: helpers.dom_id(@item),
        target: "shopping_list",
        partial: "shopping_lists/item"
      )

      redirect_to root_path, notice: 'Item added successfully!'
    else
      redirect_to root_path, alert: 'Failed to add item'
    end
  end

  def update
    @item = Item.find(params[:id])
    @item.update!(completed: !@item.completed)
    @item.broadcast_save_later_to(
      "shopping",
      target: helpers.dom_id(@item),
      partial: "shopping_lists/item"
    )
    redirect_to root_path
  end

  private

  def item_params
    params.require(:item).permit(:name)
  end
end
