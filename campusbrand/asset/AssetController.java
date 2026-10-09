package com.campusbrand.asset;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assets")
public class AssetController {
    private final AssetRepository repository;
    public AssetController(AssetRepository repository) { this.repository = repository; }

    @GetMapping public List<Asset> all(@RequestParam(required = false) String search) {
        return search == null || search.isBlank() ? repository.findAllByOrderByCreatedAtDesc() : repository.search(search.trim());
    }
    @GetMapping("/{id}") public Asset one(@PathVariable Long id) { return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Asset not found")); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public Asset create(@Valid @RequestBody Asset asset) { asset.setId(null); return repository.save(asset); }
    @PutMapping("/{id}") public Asset update(@PathVariable Long id, @Valid @RequestBody Asset input) {
        Asset asset = one(id); asset.setName(input.getName()); asset.setCategory(input.getCategory()); asset.setFileUrl(input.getFileUrl()); asset.setOwner(input.getOwner()); asset.setStatus(input.getStatus()); asset.setDescription(input.getDescription()); return repository.save(asset);
    }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id) { repository.delete(one(id)); }
    @GetMapping("/stats") public Map<String, Object> stats() {
        List<Asset> assets = repository.findAll();
        Map<String, Long> categories = new LinkedHashMap<>();
        assets.forEach(a -> categories.merge(a.getCategory(), 1L, Long::sum));
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("total", assets.size()); result.put("approved", repository.countByStatusIgnoreCase("Approved"));
        result.put("drafts", repository.countByStatusIgnoreCase("Draft")); result.put("categories", categories);
        return result;
    }
}
