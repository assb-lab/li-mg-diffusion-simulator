import { z } from "zod";

export const simulationParamsSchema = z
  .object({
    modelVersion: z.string().min(1),
    thicknessUm: z.number().positive(),
    currentDensityAcm2: z.number().nonnegative(),
    diffusionCoeffCm2PerS: z.number().positive(),
    initialConcentrationMmolPerCm3: z.number().positive(),
    betaLowerBoundMmolPerCm3: z.number().nonnegative(),
    temperatureC: z.number().optional(),
    gridCount: z.number().int().min(3),
    dtS: z.number().positive().optional(),
    maxTimeS: z.number().positive(),
    savedProfileCount: z.number().int().min(1),
  })
  .refine((params) => params.betaLowerBoundMmolPerCm3 < params.initialConcentrationMmolPerCm3, {
    message: "beta lower bound must be less than initial concentration",
    path: ["betaLowerBoundMmolPerCm3"],
  });

export type SimulationParamsInput = z.infer<typeof simulationParamsSchema>;
