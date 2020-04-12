import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.action';

export interface ShoppingListState {
    ingredients: Ingredient[],
    editedIngredient: Ingredient,
    editedIngredientIndex: number
}

// export interface AppState {
//     shoppingList: ShoppingListState
// }

const initialState: ShoppingListState = {
    ingredients: [
        new Ingredient('Apple', 10),
        new Ingredient('Tomatoes', 5)
    ],
    editedIngredient: null,
    editedIngredientIndex: -1
};

export function shoppingListReducer(
    state: ShoppingListState = initialState,
    action: ShoppingListActions.AvailableActions) {
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: [...state.ingredients, action.payload]
            };
        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload]
            };
        case ShoppingListActions.UPDATE_INGREDIENT:
            const ingredient = state.ingredients[state.editedIngredientIndex];
            const updatedIngredient = {
                ...ingredient,
                ...action.payload
            };
            const updatedIngredients = [...state.ingredients];
            updatedIngredients[state.editedIngredientIndex] = updatedIngredient;
            return {
                ...state,
                ingredients: updatedIngredients,
                editedIngredient: null,
                editedIngredientIndex: -1
            };
        case ShoppingListActions.DELETE_INGREDIENT:
            return {
                ...state,
                ingredients: state.ingredients.filter((item, index) => {
                    return index !== state.editedIngredientIndex
                }),
                editedIngredientIndex: -1,
                editedIngredient: null
            }
        case ShoppingListActions.START_EDIT:
            return {
                ...state,
                editedIngredientIndex: action.payload,
                editedIngredient: { ...state.ingredients[action.payload] }
            }
        case ShoppingListActions.STOP_EDIT:
            return {
                ...state,
                editedIngredient: null,
                editedIngredientIndex: -1
            }
        default:
            return state;
    }
}