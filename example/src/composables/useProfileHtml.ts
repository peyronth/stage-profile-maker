// useProfileHtml.ts
import { ref } from 'vue';
import type { Config } from 'stage-profile-maker/src/interfaces/index.ts';

export function useProfileHtml() {
  const html = ref<string>('');
  const loading = ref(false);

  const getHtml = async (profileMaker?: { getHtml: (config: Config) => string }, config?: any) => {
    if (!profileMaker || !config) return;

    loading.value = true;

    // Décalé pour éviter blocage UI (juste milieu)
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        html.value = profileMaker.getHtml(config);
        loading.value = false;
        resolve();
      }, 0);
    });
  };

  return {
    html,
    loading,
    getHtml,
  };
}
