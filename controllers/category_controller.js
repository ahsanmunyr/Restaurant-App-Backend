'user strict';
const sql = require('../connection');

exports.createCategory = async (req, res) =>{

    try {
        const { category_name, category_description } = req.body;
        const file = req.file;
        let imagePath = file.path;
        imagePath = imagePath.replace('\\','/');

        sql.query('INSERT INTO category(category_name, category_description, category_image) VALUES(?,?,?)', [ category_name, category_description, imagePath ] , (err, result) =>{
            if (err) return res.send(err);
            
            return res.json({
                status: true,
                msg: 'Category created successfully'
            })
        })

    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong'
        }) 
    }

}

exports.updateCategory = async (req, res) =>{

    try {
        const { category_name, category_description } = req.body;
        const { category_id } = req.query;
        const file = req.file;

        let query = `UPDATE category SET category_name = '${category_name}',
        category_description = '${category_description}' WHERE category_id = ${category_id}`;

        if(file){
            let imagePath = file.path;
            imagePath = imagePath.replace('\\','/');
            query = `UPDATE category SET category_name = '${category_name}', 
            category_description = '${category_description}', category_image = '${imagePath}' 
            WHERE category_id = ${category_id}`;
        }

        sql.query(query, (err, result) =>{
            if (err) return res.send(err);
            
            return res.json({
                status: true,
                msg: 'Category updated successfully'
            })

        })

    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong'
        }) 
    }

}

exports.getCategories = async (req, res) =>{

    try {

        sql.query('SELECT * FROM category', (err, result) =>{
            if (!err) {
                return res.json({
                    status: true,
                    msg: 'Categories fetched successfully',
                    data : result
                })
            } else{
                return res.send(err);
            }
        })

    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong'
        }) 
    }

}

exports.deleteCategory = async (req, res) =>{

    try {
        const id = req.query.category_id;

        sql.query('DELETE FROM category WHERE category_id = ? ', [ id ], (err, result) =>{
            if (!err) {
                return res.json({
                    status: true,
                    msg: 'Category deleted successfully'
                })
            } else{
                return res.send(err);
            }
        })

    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong'
        }) 
    }

}