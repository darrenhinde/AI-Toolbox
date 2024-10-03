import { z } from 'zod';

const ContentArchivistInput = z.object({
  finalContents: z.array(z.object({
    draftId: z.string().uuid(),
    title: z.string(),
    body: z.string(),
    hook: z.string(),
    callToAction: z.string(),
    sources: z.array(z.string().url()).optional(),
    editorComments: z.array(z.string()).optional(),
    approvedAt: z.date(),
  })),
  visualAssets: z.array(z.object({
    contentId: z.string().uuid(),
    assetType: z.enum(['Image', 'Video', 'Carousel']),
    assetUrl: z.string().url(),
    altText: z.string(),
    createdAt: z.date(),
  })),
  performanceReports: z.array(z.object({
    metrics: z.object({
      contentId: z.string().uuid(),
      platform: z.enum(['LinkedIn', 'Twitter', 'Facebook', 'Instagram']),
      views: z.number().nonnegative(),
      likes: z.number().nonnegative(),
      shares: z.number().nonnegative(),
      comments: z.number().nonnegative(),
      clickThroughRate: z.number().min(0).max(1),
      engagementRate: z.number().min(0).max(1),
    }),
    insights: z.array(z.string()),
    recommendations: z.array(z.string()),
    reportedAt: z.date(),
  })),
});

const ArchivedContent = z.object({
  contentId: z.string().uuid(),
  title: z.string(),
  status: z.enum(['Drafted', 'Published', 'Archived']),
  storageLocation: z.string().url(),
  archivedAt: z.date(),
});

const ArchivedContentsOutput = z.array(ArchivedContent);

export const contentArchivist = async (input: z.infer<typeof ContentArchivistInput>): Promise<z.infer<typeof ArchivedContentsOutput>> => {
  const { finalContents, visualAssets, performanceReports } = input;

  // Simulate archiving process
  const archivedContents = finalContents.map(content => ({
    contentId: content.draftId,
    title: content.title,
    status: 'Archived',
    storageLocation: `https://notion.so/content/${content.draftId}`, // Placeholder URL
    archivedAt: new Date(),
  }));

  // Validate the output
  const parsedArchivedContents = ArchivedContentsOutput.parse(archivedContents);

  return parsedArchivedContents;
};