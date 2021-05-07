import { useEffect, useState } from 'react';
import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { getUser } from '../../utilities/users-service';
import AuthPage from '../AuthPage/AuthPage';
import NewItemPage from '../UserAdmin/NewItemPage/NewItemPage';
import HomepageAdmin from '../UserAdmin/HomepageAdmin/HomepageAdmin';
import ItemDetailsPage from '../ItemDetailsPage/ItemDetailsPage'
import NavBar from '../../Components/NavBar/NavBar';
import UpdateItemPage from '../UserAdmin/UpdateItemPage/UpdateItemPage';
import CategoryPage from '../UserAdmin/CategoryPage/CategoryPage'
import Banner from '../../pictures/banner.png'
import * as itemsAPI from '../../utilities/items-api'
import * as categoriesAPI from '../../utilities/categories-api'
import * as cartsAPI from '../../utilities/carts-api'

import './App.css';
import ItemListPage from '../ItemListPage/ItemListPage';
import CartPage from '../CartPage/CartPage';

export default function App() {
	const [isAdmin, setIsAdmin] = useState(false)
	const [user, setUser] = useState(getUser());
	const [showItems, setShowItems] = useState([]);
	const [showCategories, setShowCategories] = useState([]);
	const [currentCategory, setCurrentCategory] = useState(" ");
	const [allCarts, setAllCarts] = useState([])
	const [cartItems, setCartItems] = useState([])
	const history = useHistory();
	const location = useLocation();

	const currentUrl = String(location.pathname);

	useEffect(() => {
		console.log('USE LOCATION IS =>', currentUrl)
		if (currentUrl.includes('admin')) {
			console.log('contains admin')
			history.push('/admin');
		} else {
			history.push('/');
		}
	}, [showItems, history, user])
	useEffect(() => {
		async function getItems() {
			if(user) {
				const items = await itemsAPI.getAll();
				setShowItems(items);
				const categories = await categoriesAPI.getAll();
				setShowCategories(categories)
				const carts = await cartsAPI.getAll(user._id);
				setAllCarts(carts)
				const cart = carts
					.filter((e) => e.paid === false)
					.map((e) => {return e.items})
				setCartItems(cart)

			}
		}
		getItems();
	}, [user])
	// useEffect(() => {
	// 	async function getCategories() {
	// 		const categories = await categoriesAPI.getAll();
	// 		setShowCategories(categories)
	// 	}
	// 	getCategories();
	// }, [])
	// useEffect(() => {
	// 	async function getCarts() {
	// 		// get all carts from user
	// 		const carts = await cartsAPI.getAll(user._id);
	// 		setAllCarts(carts)
	// 		const cart = carts
	// 			.filter((e) => e.paid === false)
	// 			.map((e) => {return e.items})
	// 		setCartItems(cart)
	// 		// setshowcart to all carts with paid false
	// 		// setpastorders to all carts with paid true
	// 		// setShowPaid(carts.filter((e) => e.paid === true));
	// 	}
	// 	getCarts()
	// }, [])


	useEffect(() => {
		async function changeCategories() {
			console.log('changed to =>', currentCategory)

		}
		changeCategories()
	}, [currentCategory])

	function handleAddItem(newItem) {
		setShowItems([...showItems, newItem])
	}

	function handleAddCategory(newCategory) {
		setShowCategories([...showCategories, newCategory])
	}

	async function handleDelete(deletedItemID) {
		await itemsAPI.deleteOne(deletedItemID);
		setShowItems(showItems.filter(i => i._id !== deletedItemID))
	}

	async function handleDeleteCategory(deletedCategoryID) {
		await categoriesAPI.deleteOne(deletedCategoryID);
		setShowCategories(showCategories.filter(i => i._id !== deletedCategoryID))
	}
	
	async function handleUpdate(updatedItem) {
		const newItemsArray = showItems.map(i =>
			i._id === updatedItem._id ? updatedItem : i
		  );
		  setShowItems(newItemsArray);
	}

	// ================== CART StuFF ================= //

	async function handleAddToCart(addItem) {
		console.log('Added item to cart => ', addItem)
		setCartItems([addItem.items])
		//setShowCart({...addItem})
		//const cart = await cartsAPI.updateItem(showCart[0]._id, addItemId)
	}

	return (
		<main className='App'>
			{user ? (
				<>
					<NavBar user={user} setUser={setUser} cartItems={cartItems} isAdmin={isAdmin}/>
					<div className="banner-container"><img className="banner" src={Banner} alt="Banner"/></div>
					<Switch>
						<Route path='/admin/new'>
							<NewItemPage handleAddItem={handleAddItem} showCategories={showCategories} isAdmin={isAdmin}/>
						</Route>
						<Route path='/admin/category'>
							<CategoryPage showCategories={showCategories} handleDeleteCategory={handleDeleteCategory} handleAddCategory={handleAddCategory} isAdmin={isAdmin}/>
						</Route>
						<Route exact path='/admin/edit'>
							<UpdateItemPage handleUpdate={handleUpdate} showCategories={showCategories} isAdmin={isAdmin}/>
						</Route>
						<Route path='/admin'>
							<HomepageAdmin showItems={showItems} handleDelete={handleDelete} isAdmin={isAdmin}/>
						</Route>
						<Route exact path='/cart'>
							<CartPage cartItems={cartItems} setCartItems={setCartItems} allCarts={allCarts}/>
						</Route>
						<Route exact path='/item/:id'>
							<ItemDetailsPage/>
						</Route>
						<Route exact path='/'>
							<ItemListPage showItems={showItems} showCategories={showCategories} currentCategory={currentCategory} setCurrentCategory={setCurrentCategory} handleAddToCart={handleAddToCart} allCarts={allCarts}/>
						</Route>
						<Redirect to='/' />
					</Switch>
				</>
			) : (
				<AuthPage setUser={setUser} setIsAdmin={setIsAdmin}/>
			)}
		</main>
	);
}
