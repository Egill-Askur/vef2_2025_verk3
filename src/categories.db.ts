import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import xss from "xss";

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

export async function getQuestion(slugToFind: string): Promise<Question | null> {
  const cat = await prisma.questions.findUnique({
    where: {
      questionSlug: slugToFind
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

export async function deleteQuestion(questionSlug: string) {
  const category = await getQuestion(questionSlug)
  await prisma.questions.delete({
    where: { questionSlug },
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
  const sanTitle = xss(categoryToCreate.title)
  
  const createdCategory = await prisma.categories.create({
    data: {
      title: sanTitle,
      //slug: categoryToCreate.title.toLowerCase().replaceAll(' ', '-'),
      slug: xss(slugify(categoryToCreate.title))
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
      desc: xss(questionToCreate.desc),
      categorySlug: xss(slugify(questionToCreate.categorySlug)),
      questionSlug: xss(slugify(questionToCreate.questionSlug)),
      svar1: xss(questionToCreate.svar1),
      svar2: xss(questionToCreate.svar2),
      svar3: xss(questionToCreate.svar3),
      svar4: xss(questionToCreate.svar4),
      correctAnswer: questionToCreate.correctAnswer
    },
  });

  return createdQuestion;
}

export function slugify(str: string) {
  str = str.toLowerCase().replace(/\s+/g, '-')
  return str;
}

export async function updateCategory(slug: string, body: any): Promise<Category> {
  console.log("Running updateCategory")
  const updatedCategory = await prisma.categories.update({
    where: { slug },
    data: {
      title: xss(body.title),
      slug: xss(slugify(body.title))
      //slug: body.title.toLowerCase().replace(/\s+/g, '-'), // Update slug if name changes
    },
  });

  return updatedCategory
}

export async function updateQuestion(questionSlug: string, body: any): Promise<Question> {
  console.log("Running updateQuestion")
  const updatedQuestion = await prisma.questions.update({
    where: { questionSlug },
    data: {
      desc: xss(body.desc),
      categorySlug: xss(body.categorySlug),
      questionSlug: xss(body.questionSlug),
      svar1: xss(body.svar1),
      svar2: xss(body.svar2),
      svar3: xss(body.svar3),
      svar4: xss(body.svar4),
      correctAnswer: body.correctAnswer
    },
  });

  return updatedQuestion
}