import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const CategorySchema = z.object({
  id: z.number(),
  title: z
    .string()
    .min(3, 'title must be at least three letters')
    .max(1024, 'title must be at most 1024 letters'),
  slug: z.string(),
});


const CategoryToCreateSchema = z.object({
  title: z
    .string()
    .min(3, 'title must be at least three letters')
    .max(1024, 'title must be at most 1024 letters'),
});

type Category = z.infer<typeof CategorySchema>;
type CategoryToCreate = z.infer<typeof CategoryToCreateSchema>;



const QuestionSchema = z.object({
  id: z.number(),
  desc: z
    .string()
    .min(3, 'description must be at least three letters')
    .max(1024, 'description must be at most 1024 letters'),
  categorySlug: z.string(),
  questionSlug: z.string(),
  svar1: z.string(),
  svar2: z.string(),
  svar3: z.string(),
  svar4: z.string(),
  correctAnswer: z.number()
});


const QuestionToCreateSchema = z.object({
  desc: z
    .string()
    .min(3, 'description must be at least three letters')
    .max(1024, 'description must be at most 1024 letters'),
  categorySlug: z.string(),
  questionSlug: z.string(),
  svar1: z.string(),
  svar2: z.string(),
  svar3: z.string(),
  svar4: z.string(),
  correctAnswer: z.number()
});

type Question = z.infer<typeof QuestionSchema>;
type QuestionToCreate = z.infer<typeof QuestionToCreateSchema>;



/*
const mockCategories: Array<Category> = [
  {
    id: 1,
    slug: 'html',
    title: 'HTML',
  },
  {
    id: 2,
    slug: 'css',
    title: 'CSS',
  },
  {
    id: 3,
    slug: 'js',
    title: 'JavaScript',
  },
];
*/

const prisma = new PrismaClient();

export async function getCategories(
  limit: number = 10,
  offset: number = 0,
): Promise<Array<Category>> {
  const categories = await prisma.categories.findMany();
  console.log('categories :>> ', categories);
  return categories;
  //return mockCategories;
}

export async function getQuestions(
  limit: number = 10,
  offset: number = 0,
): Promise<Array<Question>> {
  const questions = await prisma.questions.findMany();
  console.log('questions :>> ', questions);
  return questions;
  //retu
}

export async function getCategory(slugToFind: string): Promise<Category | null> {
  const cat = await prisma.categories.findUnique({
    where: {
      slug: slugToFind
    }
  });

  return cat ?? null;

}

export async function getQuestionsByCategory(catslug: string): Promise<Array<Question>> {
  const questionsOfCategory = await prisma.questions.findMany({
    where: {
      categorySlug: catslug
    }
  });

  return questionsOfCategory ?? null;

}

export async function deleteCategory(slug: string) {
  const category = await getCategory(slug)
  await prisma.categories.delete({
    where: { slug },
  })
  return
}

export function validateCategory(categoryToValidate: unknown) {
  const result = CategoryToCreateSchema.safeParse(categoryToValidate);

  return result;
}

export function validateQuestion(questionToValidate: unknown) {
  const result = QuestionToCreateSchema.safeParse(questionToValidate);

  return result;
}

export async function createCategory(categoryToCreate: CategoryToCreate): Promise<Category> {
  const createdCategory = await prisma.categories.create({
    data: {
      title: categoryToCreate.title,
      slug: categoryToCreate.title.toLowerCase().replaceAll(' ', '-'),
      /*
      svar1: categoryToCreate.svar1,
      svar2: categoryToCreate.svar2,
      svar3: categoryToCreate.svar3,
      svar4: categoryToCreate.svar4,
      correctAnswer: categoryToCreate.correctAnswer
      */
    },
  });

  return createdCategory;
}

export async function createQuestion(questionToCreate: QuestionToCreate): Promise<Question> {
  const createdQuestion = await prisma.questions.create({
    data: {
      desc: questionToCreate.desc,
      categorySlug: questionToCreate.categorySlug,
      svar1: questionToCreate.svar1,
      svar2: questionToCreate.svar2,
      svar3: questionToCreate.svar3,
      svar4: questionToCreate.svar4,
      correctAnswer: questionToCreate.correctAnswer
    },
  });

  return createdQuestion;
}

export async function updateCategory(slug: string, body: any): Promise<Category> {
  console.log("Running updateCategory")
  const updatedCategory = await prisma.categories.update({
    where: { slug },
    data: {
      title: body.title,
      slug: body.title.toLowerCase().replace(/\s+/g, '-'), // Update slug if name changes
    },
  });

  return updatedCategory
}