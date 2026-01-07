import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserPref, useUpdateUserPref } from "../Hooks/usePref";

const userPrefSchema = z.object({
  max_tokens: z.number().int().min(1, "Must be at least 1"),
  temperature: z.number().min(0).max(1),
  top_p: z.number().min(0).max(1),
  prompt_template: z.string().min(10, "Prompt must be at least 10 characters"),
});

type UserPreferencesForm = z.infer<typeof userPrefSchema>;

export const UserPreferencesModal: React.FC = () => {
  const { data: prefs, isLoading } = useUserPref();
  const { mutate, isPending: isUpdating } = useUpdateUserPref();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserPreferencesForm>({
    resolver: zodResolver(userPrefSchema),
    defaultValues: {
      max_tokens: 1000,
      temperature: 0.0,
      top_p: 0.0,
      prompt_template: "",
    },
  });

  // Reset form when prefs are loaded
  useEffect(() => {
    console.log("Use Effect Called");
    if (prefs) {
      console.log(prefs.max_tokens);
      console.log(prefs.top_p);
      reset({
        max_tokens: Number(prefs.max_tokens),
        temperature: Number(prefs.temperature),
        top_p: Number(prefs.top_p),
        prompt_template: String(prefs.prompt_template),
      });
    }
  }, [prefs, reset]);

  const onSubmit = (data: UserPreferencesForm) => {
    mutate(data, {
      onSuccess: () => toast.success("Preferences updated"),
      onError: (errors) => {
        console.log(errors);
        toast.error("Failed to save preferences");
      },
    });
  };

  if (isLoading) return <div>Loading...</div>;
  console.log(prefs);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      {/* Max Tokens */}
      <div>
        <label className="block">Max Tokens</label>
        <input
          type="number"
          {...register("max_tokens", { valueAsNumber: true })}
          className="border rounded px-2 py-1 w-full"
        />
        {errors.max_tokens && (
          <p className="text-red-500 text-sm">{errors.max_tokens.message}</p>
        )}
      </div>

      {/* Temperature */}
      <div>
        <label className="block">Temperature</label>
        <input
          type="number"
          step="0.01"
          min="0"
          max="1"
          {...register("temperature", { valueAsNumber: true })}
          className="border rounded px-2 py-1 w-full"
        />
        {errors.temperature && (
          <p className="text-red-500 text-sm">{errors.temperature.message}</p>
        )}
      </div>

      {/* Top P */}
      <div>
        <label className="block">Top P</label>
        <input
          type="number"
          step="0.01"
          min="0"
          max="1"
          {...register("top_p", { valueAsNumber: true })}
          className="border rounded px-2 py-1 w-full"
        />
        {errors.top_p && (
          <p className="text-red-500 text-sm">{errors.top_p.message}</p>
        )}
      </div>

      {/* Prompt Template */}
      <div>
        <label className="block">Prompt Template</label>
        <textarea
          {...register("prompt_template")}
          className="border rounded px-2 py-1 w-full"
          rows={4}
        />
        {errors.prompt_template && (
          <p className="text-red-500 text-sm">
            {errors.prompt_template.message}
          </p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isUpdating}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 w-full disabled:opacity-50"
      >
        {isUpdating ? "Saving..." : "Save Preferences"}
      </button>
    </form>
  );
};
