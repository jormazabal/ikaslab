# IkasLab Agent Guide

## UI component rules

- Reuse shared components from `src/shared/ui` before adding local Tailwind patterns.
- Use `GlassPanel` for translucent glass-like panels.
- Use `Tag` for compact metadata labels such as difficulty, rules, counts, and question status.
- Use `ChoiceButton` for selectable answer options.
- Use `Button` for commands and keep hover states stable; do not add vertical movement such as `hover:-translate-y-*`.
- If a new screen needs a repeated panel, tag, option, or command style, extend the shared component instead of duplicating classes in a feature module.
