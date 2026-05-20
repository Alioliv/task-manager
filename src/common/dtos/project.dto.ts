import { z } from "zod"

// ====== ENUMS (espelhando exatamente o schema.prisma) ======

export const KnowledgeAreaEnum = z.enum([
  'TECNOLOGIA',
  'SAUDE',
  'EDUCACAO',
  'FINANCAS',
  'MARKETING',
  'OUTRO',
])

export const ProjectStatusEnum = z.enum([
  'PLANEJAMENTO',
  'EM_ANDAMENTO',
  'CONCLUIDO',
  'CANCELADO',
])
// ====== CREATE ======

export const CreateProjectDto = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(100),
  description: z.string().max(500).optional(),
  knowledgeArea: KnowledgeAreaEnum,
  startDate: z.iso.datetime().optional(),
  endDate: z.iso.datetime().optional(),
  status: ProjectStatusEnum.optional(),
  ownerId: z.number().int().positive(),
})
.refine((d) => {
  if (d.startDate && d.endDate) {
    return new Date(d.startDate) <= new Date(d.endDate)
  }
  return true
}, {
  message: 'A data de início não pode ser posterior à data de fim',
  path: ['endDate'],
})

// ====== UPDATE ======

export const UpdateProjectDto = z.object({
  title: z.string().min(1, 'Título não pode ser vazio').max(100).optional(),
  description: z.string().max(500).optional(),
  knowledgeArea: KnowledgeAreaEnum.optional(),
  startDate: z.iso.datetime().optional(),
  endDate: z.iso.datetime().optional(),
  status: ProjectStatusEnum.optional(),
})
.refine((d) => {
  if (d.startDate && d.endDate) {
    return new Date(d.startDate) <= new Date(d.endDate)
  }
  return true
}, {
  message: 'A data de início não pode ser posterior à data de fim',
  path: ['endDate'],
})


// ====== TYPES ======

export type CreateProjectDto = z.infer<typeof CreateProjectDto>
export type UpdateProjectDto = z.infer<typeof UpdateProjectDto>