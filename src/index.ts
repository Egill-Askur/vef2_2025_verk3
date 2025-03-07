import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { createCategory, getCategories, getCategory, updateCategory, validateCategory, deleteCategory, 
         validateQuestion, createQuestion, getQuestions, getQuestionsByCategory} from './categories.db.js'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

//#region //Categories
app.get('/categories', async (c) => {
  var limit = 10;
  var offset = 0;
  const categories = await getCategories();
  return c.json(categories);
})

app.get('/questions', async (c) => {
  var limit = 10;
  var offset = 0;
  const questions = await getQuestions();
  return c.json(questions);
})

app.get('/questions/:slug', async (c) => {
  const slug = c.req.param('slug')
  console.log(slug)
  const category = await getCategory(slug)

  if (!category) {
    return c.json({ message: 'category not found' }, 404)
  }

  const questions = await getQuestionsByCategory(slug);
  return c.json(questions)
})

app.get('/categories/:slug', async (c) => {
  const slug = c.req.param('slug')
  const category = await getCategory(slug)

  if (!category) {
    return c.json({ message: 'not found' }, 404)
  }

  return c.json(category)
})

app.post('categories', async (c) => {
  try {
    
    const body = await c.req.json();

    if (validateCategory(body).success) {

      const createdCategory = await createCategory(body)
      return c.json({ message: 'Category created', data: createdCategory }, 201);
      
    }
    else {
      return c.json({ error: 'invalid syntax or item already exists' }, 400)
    }
  }
  catch (e) {
    return c.json({ error: 'invalid JSON' }, 400)
  }
  
})

app.post('questions', async (c) => {
  try {
    
    const body = await c.req.json();

    if (validateQuestion(body).success) {

      const createdQuestion = await createQuestion(body)
      return c.json({ message: 'Question created', data: createdQuestion }, 201);
      
    }
    else {
      return c.json({ error: 'invalid syntax or item already exists' }, 400)
    }
    
  }
  catch (e) {
    return c.json({ error: 'invalid JSON' }, 400)
  }
})

app.patch('categories/:slug', async (c) => {
  
  const slug = c.req.param('slug');
  const body: Partial<{ title: string }> = await c.req.json();

  if (!body.title) {
    return c.json({ error: 'Category title is required' }, 400);
  }

  try {
    const updatedCategory = updateCategory(slug, body)

    return c.json({ message: 'Category updated', data: updatedCategory });
  } catch (error) {
    return c.json({ error: 'Category not found or update failed' }, 404);
  }
})

app.patch('/:slug', async (c) => {
  
  const slug = c.req.param('slug');
  const body: Partial<{ title: string }> = await c.req.json();

  if (!body.title) {
    return c.json({ error: 'Category title is required' }, 400);
  }

  try {
    const updatedCategory = updateCategory(slug, body)

    return c.json({ message: 'Category updated', data: updatedCategory });
  } catch (error) {
    return c.json({ error: 'Category not found or update failed' }, 404);
  }
})
//#endregion


app.delete('categories/:slug', async (c) => {
  const slug = c.req.param('slug')
  const existingCategory = await getCategory(slug)
  
  if (!existingCategory) {
    return c.json({ error: 'Category not found' }, 404);
  }

  await deleteCategory(slug)
  return c.json({ message: 'Category deleted successfully' })
})

//#region //Questions

//#endregion


//#region //Answers

//#endregion

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
