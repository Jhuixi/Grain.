const pool = require('../config/db')

const getAllMenuItems = async () => {
	try {
		const result = await pool.query(`
		SELECT * FROM menu_items 
		--WHERE qty != 0
		ORDER BY category, item_id
		`)
		return result.rows
	} catch (error) {
		console.error('Error in getAllMenuItems:', error)
		throw error
	}
}

const getMenuItemById = async (itemId) => {
	try {
		const result = await pool.query(`
			SELECT * FROM menu_items 
			WHERE item_id = $1 
			--AND qty != 0
		`, [itemId])
		
		return result.rows[0]
	} catch (error) {
		console.error('Error in getMenuItemById:', error)
		throw error
	}
}

const getMenuItemsByCategory = async (category) => {
	try {
		const result = await pool.query(`
			SELECT item_id, name, description, category, image_url, available
			FROM menu_items 
			WHERE category = $1 
			--AND qty != 0
			ORDER BY name
		`, [category])
		
		return result.rows
	} catch (error) {
		console.error('Error in getMenuItemsByCategory:', error)
		throw error
	}
}

const getCustomisations = async (itemId) => {
	try {
		const result = await pool.query(`
			SELECT 
				cg.id AS group_id,
				cg.name AS group_name,
				ic.is_required,
				ic.max_selections,
				co.id AS option_id,
				co.option_name,
				co.is_available
			FROM item_customisations ic
			LEFT JOIN customisation_groups cg ON cg.id = ic.group_id
			LEFT JOIN customisation_options co ON co.group_id = cg.id
			WHERE ic.item_id = $1
			ORDER BY cg.id, co.id
		`, [itemId])

		const groupsMap = {}

		result.rows.forEach(row => {
			if (!groupsMap[row.group_id]) {
				groupsMap[row.group_id] = {
					id: row.group_id,
					name: row.group_name,
					is_required: row.is_required,
					max_selections: row.max_selections,
					options: []
				}
			}

			groupsMap[row.group_id].options.push({
				id: row.option_id,
				option_name: row.option_name,
				is_available: row.is_available
			})
		})

		return Object.values(groupsMap)

	} catch (error) {
		console.error('Error in getCustomisations:', error)
		throw error
	}
}

module.exports = {
  getAllMenuItems,
  getMenuItemById,
  getMenuItemsByCategory,
  getCustomisations
}