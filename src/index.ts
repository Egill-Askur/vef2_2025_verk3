import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { createCategory, getCategories, getCategory, updateCategory, validateCategory, deleteCategory, 
         validateQuestion, createQuestion, getQuestions, getQuestionsByCategory,
         updateQuestion,
         getQuestion,
         deleteQuestion,
         slugify} from './categories.db.js'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

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
  }
  catch (e) {
    return c.json({ error: 'Invalid JSON' }, 400)
  }

  const body = await c.req.json();

  if (validateCategory(body).success) {

    if (await getCategory(slugify(body.title))) {
      return c.json({ error: 'Category already exists' }, 400)
    }

    const createdCategory = await createCategory(body)
    return c.json({ message: 'Category created', data: createdCategory }, 201);
    
  }
  else {
    return c.json({ error: 'Invalid syntax: category must contain title' }, 400)
  }
})


app.post('questions', async (c) => {
  try {
    
    const body = await c.req.json();

    try {
      const bodyy = await c.req.json();
    }
    catch (e) {
      return c.json({ error: 'Invalid JSON' }, 400)
    }

    if (validateQuestion(body).success) {

      if (await getQuestion(slugify(body.questionSlug))) {
        return c.json({ error: 'questionSlug already exists' }, 400)
      }

      const category = await getCategory(slugify(body.categorySlug))

      if (!category) {
        return c.json({ message: 'Category not found' }, 404)
      }

      const createdQuestion = await createQuestion(body)
      return c.json({ message: 'Question created', data: createdQuestion }, 201);
      
    }
    else {
      return c.json({ error: 'Invalid syntax: JSON must contain desc, categorySlug, questionSlug, svar1, svar2, svar3, svar4 and correctAnswer' }, 400)
    }
    
  }
  catch (e) {
    return c.json({ error: 'An error has occurred' }, 500)
  }
})


app.patch('questions/:questionSlug', async (c) => {
  
  const slug = c.req.param('questionSlug');

  try {
    const bodyy = await c.req.json();
  }
  catch (e) {
    return c.json({ error: 'invalid JSON' }, 400)
  }

      
  const body: Partial<{ desc: string; categorySlug: string; questionSlug: string; svar1: string; svar2: string; svar3: string; svar4: string; correctAnswer: string }> = await c.req.json();

  console.log(body)
  if (Object.keys(body).length == 0) {
    return c.json({ error: 'invald JSON. JSON should not be empty' }, 400)
  }

  const existingCategory = await getQuestion(slug)
  
  if (!existingCategory) {
    return c.json({ error: 'Question not found' }, 404);
  }


  if (body.questionSlug != null && await getQuestion(body.questionSlug)) {
    return c.json({ error: 'questionSlug trying to change to already exists' }, 400);
  }

  if (body.questionSlug != null && (body.questionSlug !== slugify(body.questionSlug))) {
    return c.json({ error: 'questionSlug formatted incorrectly. Slugs must have all spaces replaced by -' }, 400);
  }

  try {
    const updatedCategory = updateQuestion(slug, body)

    return c.json({ message: 'Question updated'});
  } catch (error) {
    return c.json({ error: 'Question not found or update failed' }, 404);
  }
  
  
})

app.patch('categories/:slug', async (c) => {

  
  const slug = c.req.param('slug');

  console.log("Test pre")
  try {
    const bodyy = await c.req.json();
  }
  catch (e) {
    return c.json({ error: 'invalid JSON' }, 400)
  }
  console.log("Test post")

  const body: Partial<{ title: string }> = await c.req.json();

  
  
  if (!body.title) {
    return c.json({ error: 'Category title is required' }, 400);
  }

  const existingCategory = await getCategory(slug)
  
  if (!existingCategory) {
    return c.json({ error: 'Category not found' }, 404);
  }


  if (await getCategory(slugify(body.title))) {
    return c.json({ error: 'Category name trying to change to already exists' }, 400);
  }

  try {
    const updatedCategory = updateCategory(slug, body)

    return c.json({ message: 'Category updated' });//, data: updatedCategory });
  } catch (error) {
    return c.json({ error: 'Category update failed' }, 404);
  }
})


app.delete('categories/:slug', async (c) => {
  const slug = c.req.param('slug')
  const existingCategory = await getCategory(slug)
  
  if (!existingCategory) {
    return c.json({ error: 'Category not found' }, 404);
  }

  await deleteCategory(slug)
  return c.json({ message: 'Category deleted successfully' })
})

app.delete('questions/:questionSlug', async (c) => {
  const slug = c.req.param('questionSlug')
  const existingCategory = await getQuestion(slug)
  
  if (!existingCategory) {
    return c.json({ error: 'Question not found' }, 404);
  }

  await deleteQuestion(slug)
  return c.json({ message: 'Question deleted successfully' })
})


serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
