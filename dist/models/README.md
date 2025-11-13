# 3D Models Directory

Place your `.glb` 3D model files here.

## Expected Files

- `hero.glb` - Hero section 3D model
- `course_1.glb` - Defesa Residencial course model
- `course_2.glb` - Fundamentos de Tiro course model

## Integration

The app currently uses poster images as fallbacks. To enable 3D models:

1. Add `.glb` files to this directory
2. Install model-viewer library:
   ```bash
   npm install @google/model-viewer
   ```
3. Uncomment the model-viewer code in:
   - `src/components/Hero.tsx`
   - `src/components/CourseCard.tsx`

## Optimization

Compress your `.glb` files using [gltf-pipeline](https://github.com/CesiumGS/gltf-pipeline) with Draco compression:

```bash
npx gltf-pipeline -i input.glb -o output.glb -d
```

Target file size: < 5MB per model
