# Prisma-like type

How to implement select/include result types of Prisma

## example usage

See `sample/01-usage/main.ts`

```typescript
const userNested = User({
  include: {
    articles: true,
    comments: { select: { user: { select: { id: true } } } },
  },
});
```

The result type will determined by input type

```text
{
    id: number;
    name: string;
    email: string[] | null;
    articles: {
        id: number;
        authorId: number;
    }[];
    comments: {
        user: {
            id: number;
        } | null;
    }[];
}
```
